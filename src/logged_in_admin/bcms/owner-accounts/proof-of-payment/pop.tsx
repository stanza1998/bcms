import { observer } from "mobx-react-lite";
import { useAppContext } from "../../../../shared/functions/Context";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fileURLToPath } from "url";
import PopApi from "../../../../shared/apis/bodyCorperate/proof-of-payment/PopApi";
import { uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../../shared/database/FirebaseConfig";
import { IPop, defaultPop } from "../../../../shared/models/proof-of-payment/PopModel";


export const Pop = observer(() => {
  const { store, ui, api } = useAppContext();

  const pops = store.bodyCorperate.pop.all;


  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement> | any) => {
    e.preventDefault();

    const file = e.target.files[0];
    if (!file) return;
    const filePath = `${file.SystemSettingsApi.path}/${file.name}`;
    //const uploadTask = uploadBytesResumable(ref(storage, filePath), file)
    // await api.body.pop.create(filePath);
};

  return(
    <div>
      <div style={{marginLeft:"40px",marginTop:"20px"}}>
       <div>
          <div className="uk-align-left margin-large">
            {/* <input type="file" accept=".pdf" className="uk-button primary align-left" style={{marginRight:"100px"}} onChange={handleFileUpload}>Upload</input> */}
          </div>
        </div>
      </div> {/*Not sure if pdf parsing has to occur to get popId, Invoice id etc?*/}
        <h4  className="uk-heading section-heading ">Proof of Payment</h4>  
    </div>
  );
}
);
