// component
import SvgColor from '../../../components/svg-color';
// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Archivos',
    path: '/dashboard/files',
    icon: icon('ic_file'),
    subItems: [
      {
        title: 'Agregar',
        path: '/dashboard/files/new',
        icon: icon('ic_fileAdd'),
      }
    ],
  },
  {
    title: 'Cambio de operador',
    path: '/dashboard/transfer',
    icon: icon('ic_transfer'),
  },
];

export default navConfig;
