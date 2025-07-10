import { MenuItem } from '../models/menu.model';

export class Menu {
  // Fonction principale : retourne les pages visibles selon localStorage
 /* public static getFilteredPages(): MenuItem[] {
    const configStr = localStorage.getItem('moduleConfig');
    if (!configStr) return [];

    let allowedEntities = new Set<string>();
    try {
      const moduleConfig = JSON.parse(configStr);
      moduleConfig.forEach((mod: any) => {
        console.log("moduleConfig",moduleConfig)
        mod.selectedEntities.forEach((entity: string) => {
         
          allowedEntities.add(entity.toLowerCase());
          console.log("selectedEntities",allowedEntities)
        });
      });
    } catch (error) {
      console.error('Erreur de parsing moduleconfig:', error);
      return [];
    }

    return this.pages
      .map(group => {
        const filteredItems = group.items.filter(item => {
          // Toujours visible si pas d'entité définie
          if (!item.entity) return true;
          return allowedEntities.has(item.entity.toLowerCase());
        });
        return { ...group, items: filteredItems };
      })
      .filter(group => group.items.length > 0);
  }
      public static getFilteredPages(): MenuItem[] {
        const configStr = localStorage.getItem('moduleConfig');
        const rolesStr = localStorage.getItem('roles');
      
        if (!configStr) return [];
      
        const roles = rolesStr ? JSON.parse(rolesStr) : [];
        const isAdmin = roles.includes('ADMIN'); // <- ✅ Vérifie si c’est un admin
      
        let allowedEntities = new Set<string>();
        try {
          const moduleConfig = JSON.parse(configStr);
          moduleConfig.forEach((mod: any) => {
            mod.selectedEntities.forEach((entity: string) => {
              allowedEntities.add(entity.toLowerCase());
            });
          });
        } catch (error) {
          console.error('Erreur de parsing moduleConfig:', error);
          return [];
        }
      
        return this.pages
          .map(group => {
            const filteredItems = group.items.filter(item => {
              // Toujours visible si pas d'entité définie
              if (!item.entity) return true;
      
              const entityName = item.entity.toLowerCase();
      
              // ❌ Cacher "Gestion des Utilisateurs" si l'utilisateur n'est pas ADMIN
              if (entityName === 'gestion des utilisateurs' && !isAdmin) {
                return false;
              }
      
              return allowedEntities.has(entityName);
            });
      
            return { ...group, items: filteredItems };
          })
          .filter(group => group.items.length > 0);
      }*/
      

  // Définition complète de tous les menus
  public static pages: MenuItem[] = [
    {
      group: '',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/user-circle.svg',
          label: 'Profile',
          route: '/components/profile',
          entity: undefined,
        },
        {
          icon: 'assets/icons/heroicons/outline/user-circle.svg',
          label: 'Dashboard',
          route: '/dashboard/nfts',
          entity: undefined,
        },
      ]
    },
    {
      group: 'Employees',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Gestion des employees',
          route: '/components/employees',
          entity: 'Gestion des employees',
        },
        {
          icon: 'assets/icons/heroicons/outline/user-group.svg',
          label: 'Gestion des departements',
          route: '/components/departments',
          entity: 'Gestion des departements',
        },
      
       /* {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Historique des Interactions',
          route: '/components/interaction',
          entity: 'HistoriqueInteraction',
        },
        {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Tickets',
          route: '/components/ticket',
          entity: 'Ticket',
        },*/
      ],
    },
   
    {
      group: 'Utilisateur',
      separator: false,
      items: [
        {
          icon: 'assets/icons/heroicons/outline/users.svg',
          label: 'Gestion des Utilisateurs',
          route: '/components/table',
          entity: 'Gestion des Utilisateurs',
        },
       /* {
          icon: 'assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Gestion des Rôles',
          route: '/components/roles',
          entity: 'Gestion des Roles',
        },*/
      ],
    }
  ];
}
