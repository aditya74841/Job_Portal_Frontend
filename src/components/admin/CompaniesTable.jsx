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
import { Edit2, MoreHorizontal } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { ConfirmDialog } from "@/utils/dialog";
import axios from "axios";
import Swal from "sweetalert2";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector(
    (store) => store.company
  );
  const [filterCompany, setFilterCompany] = useState(companies);
  const navigate = useNavigate();
  const [isRefresh, setIsRefresh] = useState(false);
  useEffect(() => {
    const filteredCompany =
      companies.length >= 0 &&
      companies.filter((company) => {
        if (!searchCompanyByText) {
          return true;
        }
        return company?.name
          ?.toLowerCase()
          .includes(searchCompanyByText.toLowerCase());
      });
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText, isRefresh,setIsRefresh]);
  

    useGetAllCompanies();


  
  const handleDeleteCompany = async (companyId) => {
    try {
      const isConfirmed = await ConfirmDialog(
        `Do you really want to delete Company`
      );

      if (isConfirmed) {
        const { data } = await axios.delete(
          `${COMPANY_API_END_POINT}/delete/${companyId}`,
          {
            withCredentials: true,
          }
        );
        setIsRefresh((prev) => !prev);
        const toast = Swal.mixin({
          toast: true,
          position: "left",
          showConfirmButton: false,
          timer: 3000,
          customClass: { container: "toast" },
        });
        toast.fire({
          icon: "success",
          title: "Company Deleted Successfully",
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
        <TableCaption>A list of your recent registered companies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterCompany?.map((company) => (
            <tr>
              <TableCell>
                <Avatar>
                  <AvatarImage src={company.logo} />
                </Avatar>
              </TableCell>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.createdAt.split("T")[0]}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div
                      onClick={() =>
                        navigate(`/admin/companies/${company._id}`)
                      }
                      className="flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <Edit2 className="w-4" />
                      <span>Edit</span>
                    </div>
                    <div
                      onClick={() => handleDeleteCompany(company._id)}
                      className="flex items-center gap-1 w-fit cursor-pointer"
                    >
                      <DeleteIcon className="w-2 text-red-600" />
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

export default CompaniesTable;
