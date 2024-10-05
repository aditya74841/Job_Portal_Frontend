import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
// import {
//   Sheet,
//   SheetClose,
//   SheetContent,
//   SheetDescription,
//   SheetFooter,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "../ui/sheet";

// import { Input } from "../ui/input";
// import { Label } from "../ui/label";
import { MenuIcon } from "lucide-react";

import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Box from "@mui/material/Box";
import {
  Apartment,
  BrowseGallery,
  Home,
  WorkOutlined,
} from "@mui/icons-material";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const adminToggleDrawer = (newOpen) => () => {
    setAdminOpen(newOpen);
  };
  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText />
          </ListItemButton>
        </ListItem>
        <Link to="/">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary={"Home"} />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link to="/jobs">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {/* <WorkOutlineIcon/> */}
                <WorkOutlined />
              </ListItemIcon>
              <ListItemText primary={"Jobs"} />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link to="/browse">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <BrowseGallery />
              </ListItemIcon>
              <ListItemText primary={"Browse"} />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
      <Divider />
    </Box>
  );

  const adminDrawerList = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={adminToggleDrawer(false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemText />
          </ListItemButton>
        </ListItem>
        <Link to="/admin/companies">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <Apartment />
              </ListItemIcon>
              <ListItemText primary={"Companies"} />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link to="/admin/jobs">
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {/* <WorkOutlineIcon/> */}
                <WorkOutlined />
              </ListItemIcon>
              <ListItemText primary={"Jobs"} />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
      <Divider />
    </Box>
  );
  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16">
        <div>
          <Link to="/">
            <h1 className="text-2xl font-bold ml-2 cursor-pointer">
              Naukr<span className="text-[#F83002]">iii</span>
            </h1>
          </Link>
        </div>
        <div className="flex items-center ">
          <ul className="flex font-medium items-center gap-5">
            {user && user.role === "recruiter" ? (
              <>
                <li className="hidden sm:block">
                  <Link to="/admin/companies">Companies</Link>
                </li>
                <li className="hidden sm:block mr-2">
                  <Link to="/admin/jobs">Jobs</Link>
                </li>
                <div className="block sm:hidden ml-3 mr-2">
                  <MenuIcon onClick={adminToggleDrawer(true)} />

                  <Drawer open={adminOpen} onClose={adminToggleDrawer(false)}>
                    {adminDrawerList}
                  </Drawer>
                </div>
              </>
            ) : (
              <>
                <li className="hidden sm:block">
                  <Link to="/">Home</Link>
                </li>
                <li className="hidden sm:block">
                  <Link to="/jobs">Jobs</Link>
                </li>
                <li className="hidden sm:block mr-2">
                  <Link to="/browse">Browse</Link>
                </li>

                <div className="block sm:hidden ml-3 mr-2">
                  <MenuIcon onClick={toggleDrawer(true)} />

                  <Drawer open={open} onClose={toggleDrawer(false)}>
                    {DrawerList}
                  </Drawer>
                </div>
              </>
            )}
          </ul>

          {/* <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open</Button>
              <MenuIcon />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here. Click save when you're
                  done.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value="Pedro Duarte"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value="@peduarte"
                    className="col-span-3"
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Save changes</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet> */}

          {!user ? (
            <div className="flex items-center gap-2 ">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] mr-2">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer mr-2">
                  <AvatarImage
                    src={user?.profile?.profilePhoto}
                    alt="@shadcn"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-60 mr-2 sm:w-80">
                <div className="">
                  <div className="flex  gap-2 space-y-2">
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        src={user?.profile?.profilePhoto}
                        alt="@shadcn"
                      />
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user?.fullname}</h4>
                      <p className="text-sm text-muted-foreground mt-auto">
                        {user?.profile?.bio}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col my-2 text-gray-600">
                    {user && user.role === "student" && (
                      <div className="flex w-fit items-center gap-2 cursor-pointer">
                        <User2 />
                        <Button variant="link">
                          {" "}
                          <Link to="/profile">View Profile</Link>
                        </Button>
                      </div>
                    )}

                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <LogOut />
                      <Button onClick={logoutHandler} variant="link">
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
