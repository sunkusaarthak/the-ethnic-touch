package cron

import (
	"context"
	"log"
	"time"

	"ethnictouch/internal/service"
)

func StartDelhiveryCron(ctx context.Context, orderSvc service.OrderService) {
	go func() {
		istLocation := time.FixedZone("IST", 5*3600+30*60)
		for {
			now := time.Now().In(istLocation)
			// Calculate next 1:30 PM IST (Cutoff for same day shipping)
			nextRun := time.Date(now.Year(), now.Month(), now.Day(), 13, 30, 0, 0, istLocation)
			if now.After(nextRun) {
				nextRun = nextRun.Add(24 * time.Hour)
			}

			sleepDuration := nextRun.Sub(now)
			log.Printf("[Cron] Next Delhivery batch pickup scheduled in %v (at %v IST)", sleepDuration, nextRun.Format("2006-01-02 15:04:05"))

			timer := time.NewTimer(sleepDuration)
			select {
			case <-ctx.Done():
				timer.Stop()
				log.Println("[Cron] Delhivery batch pickup cron stopped gracefully.")
				return
			case <-timer.C:
			}

			// Run task
			log.Println("[Cron] Starting Delhivery batch pickup...")
			dispatched, failed, err := orderSvc.DispatchPendingOrders("")
			if err != nil {
				log.Printf("[Cron] Delhivery batch dispatch: %d shipped, %d need attention: %v", dispatched, failed, err)
			} else {
				log.Printf("[Cron] Delhivery batch dispatch complete: %d dispatched, %d failed/reverted", dispatched, failed)
			}
		}
	}()
}
