Set-Location -Path "$PSScriptRoot\docker"

docker-compose down -v
docker-compose up --build -d

$URL = "http://localhost:5173/login"
$maxAttempts = 30
$attempt = 0

Write-Host "Waiting for $URL to become available..."

while ($attempt -lt $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri $URL -UseBasicParsing -TimeoutSec 1
        if ($response.StatusCode -eq 200) {
            Write-Host "Service is up!"
            Start-Process $URL
            break
        }
    } catch {
        Start-Sleep -Seconds 1
        $attempt++
    }
}

if ($attempt -eq $maxAttempts) {
    Write-Host "Timeout: $URL did not respond in time."
    exit 1
}
