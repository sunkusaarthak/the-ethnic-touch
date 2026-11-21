package cron

import (
	"context"
	"log"
	"time"

	"ethnictouch/internal/repository"
	"ethnictouch/internal/service"
)

func StartDelhiveryCron(ctx context.Context, orderRepo repository.OrderRepository, delhiverySvc service.DelhiveryService) {
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
			
			orders, err := orderRepo.GetPendingDeliveryOrders()
			if err != nil {
				log.Printf("[Cron] Error fetching pending delivery orders: %v", err)
				continue
			}

			if len(orders) == 0 {
				log.Println("[Cron] No pending orders for Delhivery batch pickup.")
				continue
			}

			// Implement exponential backoff for the batch pickup
			maxRetries := 3
			for i := 0; i < maxRetries; i++ {
				err = delhiverySvc.BatchPickup(orders)
				if err == nil {
					log.Printf("[Cron] Successfully completed batch pickup for %d orders.", len(orders))
					
					// Mark orders as picked up internally
					for _, o := range orders {
						orderRepo.UpdateOrderStatus(o.ID, "shipped", o.RazorpayPaymentID, "DUMMY_TRACKING", time.Now().Format(time.RFC3339), o.UnlockedGift)
					}
					break
				}
				
				log.Printf("[Cron] Batch pickup failed (attempt %d/%d): %v", i+1, maxRetries, err)
				backoffTimer := time.NewTimer(time.Duration(2<<i) * time.Minute)
				select {
				case <-ctx.Done():
					backoffTimer.Stop()
					return
				case <-backoffTimer.C:
				}
			}

			if err != nil {
				log.Printf("[ADMIN ALERT] CRITICAL: Delhivery batch pickup completely failed after retries! Pushing to tomorrow.")
				// We do nothing here; the orders remain "paid" and will be picked up tomorrow.
			}
		}
	}()
}
