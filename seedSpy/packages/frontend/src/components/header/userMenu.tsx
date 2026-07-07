import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { CircleUser, LogOut, Settings } from "lucide-react";
import { FunctionComponent, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from '../../utils/AuthContext'

const UserMenu: FunctionComponent = () => {
  const { logout } = useContext(AuthContext) || {};
  const authUserName: string | undefined = useContext(AuthContext)?.authUser?.username;

  const handleLogout = () => {
    if (logout) {
      logout();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="mr-2">
        <Avatar>
          <AvatarFallback className="bg-white bg-opacity-60 text-xl text-white font-bold">
            {authUserName && authUserName[0].toUpperCase()}
            {!authUserName && "U"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-12">
        <DropdownMenuLabel className='text-sm'>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='hover:cursor-pointer hover:bg-slate-200 pl-2 pr-10'>
          <CircleUser className="mr-1 h-5" />
          <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='over:cursor-pointer hover:bg-slate-200 pl-2 pr-10'>
          <Settings className="mr-1 h-5" href="/settings" to="/settings" />{" "}
          <Link to="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='hover:cursor-pointer hover:bg-slate-200 pl-2 pr-10' onClick={handleLogout}>
          <LogOut className="mr-1 h-5" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
