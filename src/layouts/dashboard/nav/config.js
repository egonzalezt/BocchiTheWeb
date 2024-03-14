// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
  },
  {
    title: 'clientes',
    path: '/dashboard/clientes',
    icon: icon('ic_user'),
    subItems: [
      {
        title: 'Agregar',
        path: '/dashboard/clientes/new',
        icon: icon('ic_plus'),
      }
    ],
  },
];

export default navConfig;
