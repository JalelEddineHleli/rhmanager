
export interface AppConfig {
    contact?: {
      layout: {
        [key: string]: {
          x: number;
          y: number;
          w: number;
          h: number;
        };
      };
      activeEntities: string[];
      disabledFeatures?: string[];
    };
  }
  
  export interface DashboardWidget {
    id: string;
    name: string;
    active: boolean;
    component?: any;
    entities: { name: string; selected: boolean }[];
  }
  