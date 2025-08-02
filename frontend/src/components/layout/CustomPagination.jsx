import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const CustomPagination = ({ resPerPage, filteredProductsCount }) => {
	const [currentPage, setCurrentPage] = useState(1);

	let [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const page = Number(searchParams.get("page")) || 1;
	const totalPages = Math.ceil(filteredProductsCount / resPerPage);

	useEffect(() => {
		setCurrentPage(page);
	}, [page]);

	const handlePageChange = (event, value) => {
		setCurrentPage(value);

		if (searchParams.has("page")) {
			searchParams.set("page", value);
		} else {
			searchParams.append("page", value);
		}

		const path = window.location.pathname + "?" + searchParams.toString();
		navigate(path);
	};

	return (
		<div className="d-flex justify-content-center my-5">
			{filteredProductsCount > resPerPage && (
				<Stack spacing={2}>
					<Pagination
						count={totalPages}
						page={currentPage}
						onChange={handlePageChange}
						color="primary"
						showFirstButton
						showLastButton
						siblingCount={0}
						sx={{
							backgroundColor: "transparent",
							"& .MuiPaginationItem-root": {
								border: "1px solid #f57c00",
								color: "#f57c00",
								borderRadius: 0,
								minWidth: 32,
								height: 32,
								margin: "0 4px",
							},
							"& .MuiPaginationItem-root.Mui-selected": {
								backgroundColor: "#f57c00",
								color: "#fff",
								border: "1px solid #f57c00",
							},
							"& .MuiPaginationItem-root:hover": {
								backgroundColor: "#fff3e0",
								borderColor: "#f57c00",
							},
						}}
					/>
				</Stack>
			)}
		</div>
	);
};

export default CustomPagination;
