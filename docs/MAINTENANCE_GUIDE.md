# 👥 Guide d'Utilisation - Équipe YOOL

Ce guide est destiné aux administrateurs réseau et techniciens installant la station.

## 🔧 Préparation d'une nouvelle station
1. Copiez le dossier `.ps1` sur le PC cible.
2. Créez un identifiant unique pour ce PC (ex: `POSTE_ACCEIL_01`).
3. Modifiez le `.env` de l'agent pour y mettre ce code.
4. Lancez l'application une première fois.

## �️ Dépannage du Build (.exe)

Si vous rencontrez l'erreur `Fatal error: Unable to commit changes` (rcedit) lors du build :

1.  **Désactivez l'Antivirus** : Windows Defender bloque souvent l'écriture des métadonnées dans le `.exe`. Désactivez-le temporairement.
2.  **Nettoyez le dossier `release`** : Supprimez manuellement le dossier `release` avant de relancer `npm run build`.
3.  **Processus actifs** : Vérifiez qu'aucune instance de `YOOL Scan Station` ne tourne dans le Gestionnaire des tâches.

## �🔓 Activation du poste
Lorsqu'un nouveau PC se connecte, l'agent affichera **"Accès Refusé"**.
1. Allez dans la base de données MySQL, table `stations`.
2. Repérez la nouvelle ligne avec le `station_code` du PC.
3. Changez le `status` de `pending` à **`online`**.
4. L'agent deviendra opérationnel instantanément.

## 🚩 FAQ & Dépannage

### "Serveur Injoignable" ?
- Vérifiez que MySQL est lancé.
- Lancez `stop_all.bat` puis `silent_launch.vbs`.
- Le port 3000 est peut-être déjà utilisé par un autre programme.

### "Clé Invalide" ?
- La clé dans le `.env` de l'Agent ne correspond pas au hash enregistré dans la BDD. 
- Pour réinitialiser : Supprimez la ligne du PC dans la table `stations` et relancez.

### L'app reste en arrière-plan ?
Utilisez **`stop_all.bat`** pour forcer la fermeture propre de tous les serveurs.
