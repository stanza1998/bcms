import React from "react";
import PrintIcon from "@mui/icons-material/Print";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArticleIcon from "@mui/icons-material/Article";
import { IconButton } from "@mui/material";

import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import Toolbar2 from "../../../shared/Toolbar2";

export const SupplierReturns = () => {
  return (
    <div>
      <Toolbar2
        leftControls={
          <div className="">
            <IconButton uk-tooltip="Create Invoice">
              <CreateNewFolderIcon />
            </IconButton>
          </div>
        }
        rightControls={
          <div>
            <IconButton uk-tooltip="Print invoices">
              <PrintIcon />
            </IconButton>
            <IconButton uk-tooltip="Export to pdf">
              <PictureAsPdfIcon />
            </IconButton>
            <IconButton uk-tooltip="Export to csv">
              <ArticleIcon />
            </IconButton>
          </div>
        }
      />
    </div>
  );
};
