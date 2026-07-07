import { NavigationMenuList, NavigationMenuItem } from '@radix-ui/react-navigation-menu';
import { FunctionComponent, useContext } from 'react';
import { NavigationMenu } from '../ui/navigation-menu';
import UserMenu from './userMenu';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import AuthContext from '../../utils/AuthContext';

const Header: FunctionComponent = () => {
  const { authUser } = useContext(AuthContext) || {};

  const columns = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Avatar",
      link: "/avatar",
    },
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Pictures",
      link: "/pictures",
    },
  ];

  return (
    <header id='seedHeader' 
    className="flex border-b-2 text-white border-slate-100 border-opacity-40
    flex-row max-w-[90vw] m-auto bg-transparent bg-opacity-0 p-4"
    >
      <h1 className='text-3xl text-white font-bold'>SeedSpy</h1>
      <NavigationMenu className="flex items-center ml-auto mr-auto">
        <NavigationMenuList className="flex items-center ml-auto mr-auto">
          {columns.map((column) => (
            <NavigationMenuItem key={column.link}>
              <Link to={column.link} className="mr-2">
                <Button className='text-white' variant="link">{column.name}</Button>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex">
        {
          authUser ? <UserMenu /> : <Link to="/auth">
            <Button variant="secondary">Login</Button>
          </Link>
        }
      </div>
    </header>
  );
};

export default Header;
