package cron

import (
	"context"
	"testing"
	"time"
)

func TestNextDelhiveryBatch(t *testing.T) {
	cutoff := time.Date(2026, time.November, 27, 8, 0, 0, 0, time.UTC)
	for _, tt := range []struct {
		name string
		now  time.Time
		want time.Time
	}{
		{"before cutoff", cutoff.Add(-time.Second), cutoff},
		{"at cutoff", cutoff, cutoff},
		{"after cutoff", cutoff.Add(time.Second), cutoff.AddDate(0, 0, 1)},
	} {
		t.Run(tt.name, func(t *testing.T) {
			got := nextDelhiveryBatch(tt.now)
			if !got.Equal(tt.want) || got.Format("15:04 MST") != "13:30 IST" {
				t.Fatalf("next batch = %v, want %v at 13:30 IST", got, tt.want)
			}
		})
	}
}

func TestDelhiveryCronDispatchesBatch(t *testing.T) {
	ctx, cancel := context.WithTimeout(t.Context(), 2*time.Second)
	defer cancel()
	calls := 0
	runDelhiveryCron(ctx, func(now time.Time) time.Time {
		return now.Add(time.Millisecond)
	}, func(orderID string) (int, int, error) {
		calls++
		if orderID != "" {
			t.Errorf("scheduler passed order ID %q, want an unfiltered batch", orderID)
		}
		cancel()
		return 1, 0, nil
	})
	if calls != 1 {
		t.Fatalf("dispatcher called %d times, want once", calls)
	}
}
