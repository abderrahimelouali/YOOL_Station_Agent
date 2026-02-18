Set WshShell = CreateObject("WScript.Shell")
strPath = "C:\Users\eloua\Desktop\YOOL\AgentPost\.ps1\"

' 1. Lancer le Serveur (Caché)
WshShell.Run "powershell.exe -Command ""cd '" & strPath & "yool-station-server'; npm start""", 0, False

' 2. Lancer Vite (Caché)
WshShell.Run "powershell.exe -Command ""cd '" & strPath & "yool-station-agent'; npx vite""", 0, False

' Attendre 5 secondes pour que Vite soit prêt
WScript.Sleep 5000

' 3. Lancer l'Agent Electron (Caché - Seul la fenêtre Electron apparaîtra)
WshShell.Run "powershell.exe -Command ""cd '" & strPath & "yool-station-agent'; npm start""", 0, False
