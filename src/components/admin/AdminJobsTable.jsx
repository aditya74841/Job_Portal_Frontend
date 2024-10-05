import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, Eye, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "@/utils/dialog";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";

const AdminJobsTable = () => {
  const { allAdminJobs, searchJobByText } = useSelector((store) => store.job);

  const [filterJobs, setFilterJobs] = useState(allAdminJobs);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log('called');
    const filteredJobs = allAdminJobs.filter((job) => {
      if (!searchJobByText) {
        return true;
      }
      return (
        job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||
        job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase())
      );
    });
    setFilterJobs(filteredJobs);
  }, [allAdminJobs, searchJobByText]);
  const handleDeleteJobs = async (jobId) => {
    try {
      const isConfirmed = await ConfirmDialog(
        `Do you really want to delete this job`
      );

      if (isConfirmed) {
        const { data } = await axios.delete(
          `${JOB_API_END_POINT}/delete/${jobId}`,
          {
            withCredentials: true,
          }
        );
        // setIsRefresh((prev) => !prev);
        const toast = Swal.mixin({
          toast: true,
          position: "left",
          showConfirmButton: false,
          timer: 3000,
          customClass: { container: "toast" },
        });
        toast.fire({
          icon: "success",
          title: "Job Deleted Successfully",
          padding: "10px 20px",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error,
      });
    }
  };
  return (
    <div>
      <Table>
        <TableCaption>A list of your recent posted jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs?.map((job) => (
            <tr>
              <TableCell>{job?.company?.name}</TableCell>
              <TableCell>{job?.title}</TableCell>
              <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div
                      onClick={() => navigate(`/admin/jobs/${job._id}`)}
                      className="flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <Edit2 className="w-4" />
                      <span>Edit</span>
                    </div>
                    <div
                      onClick={() =>
                        navigate(`/admin/jobs/${job._id}/applicants`)
                      }
                      className="flex items-center w-fit gap-2 cursor-pointer mt-2"
                    >
                      <Eye className="w-4" />
                      <span>Applicants</span>
                    </div>
                    <div
                      onClick={() => handleDeleteJobs(job._id)}
                      className="flex items-center gap-2 w-fit cursor-pointer mt-2"
                    >
                      <DeleteIcon className="w-4 text-red-600 " />
                      <span>Delete</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </tr>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
