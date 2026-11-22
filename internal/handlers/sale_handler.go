package handlers

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"ethnictouch/internal/models"
	"ethnictouch/internal/repository"
)

func SaleHandler(store repository.SaleStore, admin bool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		w.Header().Set("Content-Type", "application/json")
		if r.Method == http.MethodGet {
			sale, err := store.Load()
			if err != nil {
				writeOrderError(w, http.StatusServiceUnavailable, "Could not load sale settings")
				return
			}
			if !admin && !sale.Active(time.Now()) {
				sale.Enabled = false
			}
			json.NewEncoder(w).Encode(sale)
			return
		}
		if !admin || r.Method != http.MethodPut {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		var sale models.Sale
		if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 16<<10)).Decode(&sale); err != nil {
			writeOrderError(w, http.StatusBadRequest, "Invalid sale settings")
			return
		}
		sale.Name = strings.TrimSpace(sale.Name)
		for i := range sale.Collections {
			sale.Collections[i] = strings.TrimSpace(sale.Collections[i])
			if sale.Collections[i] == "" {
				writeOrderError(w, http.StatusBadRequest, "Collection name cannot be blank")
				return
			}
		}
		if sale.Enabled && (sale.Name == "" || len(sale.Name) > 100 || sale.Percent < 1 || sale.Percent > 90 ||
			sale.StartsAt.IsZero() || !sale.EndsAt.After(sale.StartsAt) || !sale.EndsAt.After(time.Now())) {
			writeOrderError(w, http.StatusBadRequest, "Set a name, a discount from 1 to 90%, and a valid start and future end time")
			return
		}
		if err := store.Save(sale); err != nil {
			writeOrderError(w, http.StatusInternalServerError, "Could not save sale settings")
			return
		}
		json.NewEncoder(w).Encode(sale)
	}
}
