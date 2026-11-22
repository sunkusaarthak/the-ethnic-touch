package models

import (
	"math"
	"strings"
	"time"
)

type Sale struct {
	Enabled     bool      `json:"enabled"`
	Name        string    `json:"name"`
	Percent     int       `json:"percent"`
	Collections []string  `json:"collections"`
	StartsAt    time.Time `json:"startsAt"`
	EndsAt      time.Time `json:"endsAt"`
}

func (s Sale) Active(now time.Time) bool {
	return s.Enabled && s.Percent > 0 && !now.Before(s.StartsAt) && now.Before(s.EndsAt)
}

func (s Sale) UnitSavings(p Product) int64 {
	if p.IsPreorder || p.OriginalPrice > p.Price {
		return 0
	}
	if len(s.Collections) > 0 {
		matches := false
		for _, name := range s.Collections {
			if strings.EqualFold(strings.TrimSpace(p.Collection), name) {
				matches = true
				break
			}
		}
		if !matches {
			return 0
		}
	}
	paise := int64(math.Round(p.Price * 100))
	maximum := paise - 100 // Leave at least one rupee payable on each eligible unit.
	if maximum < 1 {
		return 0
	}
	savings := (paise*int64(s.Percent) + 50) / 100
	if savings > maximum {
		return maximum
	}
	return savings
}
