Set WshShell = CreateObject("WScript.Shell")

' Chemin vers le répertoire des applications
Dim BasePath
BasePath = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)

' 1. Lancer le Serveur Proxy local (Node.js) silencieusement
WshShell.Run "cmd.exe /c cd /d """ & BasePath & "\server"" && npm run dev", 0, False

' Pause de 3 secondes pour laisser le serveur s'initialiser
WScript.Sleep 3000

' 2. Lancer l'Agent Frontend (Electron) silencieusement
WshShell.Run "cmd.exe /c cd /d """ & BasePath & "\agent"" && npm run dev", 0, False
