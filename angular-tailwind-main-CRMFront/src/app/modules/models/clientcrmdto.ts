
import { AppRole } from './app-role'; // Si vous avez un modèle de rôle
import { AppConfig } from './AppConfig';

export interface clientcrmdto {
    content:clientcrmdto[];
    totalPages: number;
    totalElements: number;
   
selected: boolean;
uuid :string;
  id: string;               // ID unique de l'utilisateur
  email: string;            // Email de l'utilisateur
  firstName: string;        // Prénom
  lastName: string;         // Nom
  phone: string;            // Numéro de téléphone
  address: string;          // Adresse
  password: string;         // Mot de passe
  confirmPassword: string;  // Confirmation du mot de passe
  roles: AppRole[];         // Rôles associés à l'utilisateur
  acceptTerms: boolean; 
  enabled: boolean; 
  createdAt:string
  config: {
    config: ModuleConfig[];
  };
    // Accepte les termes et conditions
}
interface ModuleConfig {
    module: string;
    selectedEntities: string[];
    active: boolean;
  }