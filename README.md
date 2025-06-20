# NTUA ECE SAAS 2025 PROJECT

## TEAM 21

🛠️ Οδηγίες
Βεβαιώσου ότι το Docker Desktop είναι ανοιχτό και σε λειτουργία.

Κάνε clone το αποθετήριο και μπες στον φάκελο του project:

bash

git clone https://github.com/ntua/saas25-21.git
cd your-repo
Εκτέλεσε το κατάλληλο script ανάλογα με το λειτουργικό σύστημα σου:

🔵 macOS ή Linux:

bash terminal
./start.sh


🟦 Windows (PowerShell):

powershell terminal
.\start.ps1


Το script θα:

Μεταβεί στον φάκελο docker/

Κλείσει και καθαρίσει τυχόν προηγούμενα containers με docker-compose down -v

Εκκινήσει ξανά τα containers με docker-compose up -d

Περιμένει έως ότου το http://localhost:5173/login είναι διαθέσιμο

Ανοίξει αυτόματα την σελίδα στον browser