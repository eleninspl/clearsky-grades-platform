# NTUA ECE SAAS 2025 PROJECT

## TEAM 21

🛠️ Οδηγίες
Βεβαιώσου ότι το Docker Desktop είναι ανοιχτό και σε λειτουργία.

Κάνε clone το αποθετήριο και μπες στον φάκελο του project:

bash
Copy
Edit
git clone https://github.com/your-username/your-repo.git
cd your-repo
Εκτέλεσε το κατάλληλο script ανάλογα με το λειτουργικό σύστημα σου:

🔵 macOS ή Linux:

bash
Copy
Edit
./start.sh
🟦 Windows (PowerShell):

powershell
Copy
Edit
.\start.ps1
Το script θα:

Μεταβεί στον φάκελο docker/

Κλείσει και καθαρίσει τυχόν προηγούμενα containers με docker-compose down -v

Εκκινήσει ξανά τα containers με docker-compose up -d

Περιμένει έως ότου το http://localhost:5173 είναι διαθέσιμο

Ανοίξει αυτόματα την σελίδα στον browser