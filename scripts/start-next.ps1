$env:HOST='0.0.0.0'
Start-Process -FilePath npm -ArgumentList 'run','dev' -WorkingDirectory (Resolve-Path ..\) -NoNewWindow -PassThru
