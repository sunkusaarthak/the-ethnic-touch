package cron

import (
	"context"
	"log"
	"time"

	"ethnictouch/internal/service"
)

func StartDelhiveryCron(ctx context.Context, orderSvc service.OrderService) {
	go runDelhiveryCron(ctx, nextDelhiveryBatch, orderSvc.DispatchPendingOrders)
}

func nextDelhiveryBatch(now time.Time) time.Time {
	ist := time.FixedZone("IST", 5*3600+30*60)
	now = now.In(ist)
	nextRun := time.Date(now.Year(), now.Month(), now.Day(), 13, 30, 0, 0, ist)
	if now.After(nextRun) {
		nextRun = nextRun.AddDate(0, 0, 1)
	}
	return nextRun
}

func runDelhiveryCron(ctx context.Context, nextBatch func(time.Time) time.Time, dispatch func(string) (int, int, error)) {
	for ctx.Err() == nil {
		now := time.Now()
		nextRun := nextBatch(now)
		delay := nextRun.Sub(now)
		log.Printf("[Cron] Next Delhivery batch pickup scheduled in %v (at %v IST)", delay, nextRun.Format("2006-01-02 15:04:05"))

		timer := time.NewTimer(delay)
		select {
		case <-ctx.Done():
			timer.Stop()
			log.Println("[Cron] Delhivery batch pickup cron stopped gracefully.")
			return
		case <-timer.C:
		}
		if ctx.Err() != nil {
			return
		}

		log.Println("[Cron] Starting Delhivery batch pickup...")
		dispatched, failed, err := dispatch("")
		if err != nil {
			log.Printf("[Cron] Delhivery batch dispatch: %d shipped, %d need attention: %v", dispatched, failed, err)
		} else {
			log.Printf("[Cron] Delhivery batch dispatch complete: %d dispatched, %d failed/reverted", dispatched, failed)
		}
	}
}
