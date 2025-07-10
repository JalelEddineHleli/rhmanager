import { AppRole } from './app-role'; // Si vous avez un modèle de rôle

export interface UserDto {
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
  createdAt:String
    // Accepte les termes et conditions
}
