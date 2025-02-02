const PEAK_HOURS_MULTIPLIER = 1.5; // +50% pendant les heures de pointe
const LOW_SUPPLY_MULTIPLIER = 1.3; // +30% quand peu de chauffeurs sont disponibles
const BASE_PRICE_PER_KM = 700; // Prix de base par km en FCFA

interface PricingFactors {
  availableDrivers: number;
  totalDrivers: number;
  currentHour: number;
  weekday: number;
}

export const calculateDynamicPrice = (
  distance: number,
  serviceType: ServiceType,
  factors: PricingFactors
): number => {
  let multiplier = 1.0;

  // Ajustement selon l'offre (nombre de chauffeurs disponibles)
  const driverAvailabilityRatio = factors.availableDrivers / factors.totalDrivers;
  if (driverAvailabilityRatio < 0.2) {
    multiplier *= LOW_SUPPLY_MULTIPLIER;
  } else if (driverAvailabilityRatio < 0.4) {
    multiplier *= 1.15; // +15% quand l'offre est modérément basse
  }

  // Ajustement selon l'heure (heures de pointe)
  const isPeakHour = isPeakTime(factors.currentHour, factors.weekday);
  if (isPeakHour) {
    multiplier *= PEAK_HOURS_MULTIPLIER;
  }

  // Prix de base selon le service
  let basePrice = distance * BASE_PRICE_PER_KM;
  switch (serviceType) {
    case 'COURSE_PREMIUM':
      basePrice *= 1.5; // 50% plus cher
      break;
    case 'TIAK_TIAK':
      basePrice *= 0.7; // 30% moins cher
      break;
    case 'COVOITURAGE':
      basePrice *= 0.8; // 20% moins cher
      break;
    case 'COURSE_CLASSIQUE':
    default:
      break;
  }

  // Application du multiplicateur dynamique
  const finalPrice = Math.round(basePrice * multiplier);

  // Garantir un prix minimum selon le service
  const minimumPrice = getMinimumPrice(serviceType);
  return Math.max(finalPrice, minimumPrice);
};

const getMinimumPrice = (serviceType: ServiceType): number => {
  switch (serviceType) {
    case 'COURSE_PREMIUM':
      return 2500;
    case 'TIAK_TIAK':
      return 1000;
    case 'COVOITURAGE':
      return 1200;
    case 'COURSE_CLASSIQUE':
    default:
      return 1500;
  }
};

// Détermine si c'est une heure de pointe
const isPeakTime = (hour: number, weekday: number): boolean => {
  // Weekday: 0 (Dimanche) à 6 (Samedi)
  if (weekday === 0 || weekday === 6) {
    // Week-end: heures de pointe différentes
    return (hour >= 10 && hour <= 13) || (hour >= 18 && hour <= 21);
  }

  // Jours de semaine
  return (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19);
};