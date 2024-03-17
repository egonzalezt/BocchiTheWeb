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
    title: 'Archivos',
    path: '/dashboard/files',
    icon: icon('ic_user'),
    subItems: [
      {
        title: 'Agregar',
        path: '/dashboard/files/new',
        icon: icon('ic_plus'),
      }
    ],
  },
];

export default navConfig;
