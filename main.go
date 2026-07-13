package main
import ("encoding/json";"net/http")
func main() {
  http.HandleFunc("/api/deploy", func(w http.ResponseWriter, r *http.Request) {
    var req struct { Service string `json:"service"`; Version string `json:"version"`; Strategy string `json:"strategy"` }
    json.NewDecoder(r.Body).Decode(&req)
    json.NewEncoder(w).Encode(map[string]any{"deploymentId":"dep_"+randStr(),"status":"in_progress","service":req.Service,"version":req.Version})
  })
  http.HandleFunc("/api/rollback", func(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode(map[string]string{"status":"rolled_back","previousVersion":"1.2.0","currentVersion":"1.1.0"})
  })
  http.HandleFunc("/api/status", func(w http.ResponseWriter, r *http.Request) { json.NewEncoder(w).Encode(map[string]any{"active":4,"queued":2,"failed":0,"history":[]}) })
  http.ListenAndServe(":8080", nil)
}
func randStr() string { return "abc123def456" }
