package models

type SpinWheelProbs struct {
	Prob5Off       int `json:"prob_5_off"`
	Prob10Off      int `json:"prob_10_off"`
	ProbBetterLuck int `json:"prob_better_luck"`
}

type SpinWheelConfig struct {
	Enabled                  bool           `json:"enabled"`
	NewUserKurthiThreshold   int            `json:"new_user_kurthi_threshold"`
	OrderKurthiThreshold     int            `json:"order_kurthi_threshold"`
	FirstTimeProbs           SpinWheelProbs `json:"first_time_probs"`
	ReturningProbs           SpinWheelProbs `json:"returning_probs"`
}

type SpinWheelStats struct {
	NewUsersSinceLastKurthi int `json:"new_users_since_last_kurthi"`
	OrdersSinceLastKurthi   int `json:"orders_since_last_kurthi"`
}
