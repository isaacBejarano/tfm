import { FitoElement, Season } from '@agenda/agenda.enum';

type Agenda = {
  id: string; // guuid
  userId: string; // guuid -> 1 user has many agendas
  title: string;
  created: string; // agenda's TODAY Date
  seasonStart: Season; // Season
  gardenTasks: GardenTask[];
};

type GardenTask = {
  id: string; // guuid
  agendaId: string; // guuid -> 1 agenda has many tasks
  date: Date;
  action: GardenAction;
  crops: Crop[];
};

type Crop = {
  id: string; // guuid
  // taxonomy
  vernacular: string;
  taxonList?: string;
  species?: string;
  // health
  healthBenefit?: string;
  fitoElements?: FitoElement;
  // desc
  habitat?: string;
  soilType?: string;
  soilComposition?: string;
  stem?: string;
  leaves?: string;
  roots?: string;
  buds?: string;
  flowers?: string;
  fruits?: string;
  // care
  exposureSun?: string;
  exposureHeat?: string;
  exposureCold?: string;
  exposureMoist?: string;
  exposureWind?: string;
  exposureRain?: string;
  watering?: string;
  pollination?: string;
  fertilization?: string;
  fruitCare?: string;
  evapoCoeficient?: string;
  // menaces
  plagueVertebrates?: string[];
  plagueBugs?: string[];
  plagueFungae?: string[];
  plagueUnicellular?: string[];
};

type GardenAction =
  'watering' | 'seeding' | 'harvest' | 'rain' | 'blossom' | 'snow' | 'sun' | 'clouds';

export type { Agenda, GardenAction, GardenTask };

/*
 * VALIDATIONS TODO:
 */
