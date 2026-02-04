// Service simulé pour l'API Module 1
// Dans un vrai environnement, utilisera axios pour taper sur l'API externe

const VALID_CARDS = ['MOCK_CARD_12345', 'CARD_ADMIN_999'];

async function verifyCard(cardUid) {
    // Simulation d'un appel réseau
    return new Promise((resolve) => {
        setTimeout(() => {
            if (VALID_CARDS.includes(cardUid)) {
                resolve({
                    valid: true,
                    student: {
                        id: 'STUDENT_001',
                        name: 'Jean Dupont',
                        status: 'active'
                    }
                });
            } else {
                resolve({
                    valid: false,
                    reason: 'Carte inconnue ou invalide'
                });
            }
        }, 500); // Latence simulée
    });
}

module.exports = {
    verifyCard
};
