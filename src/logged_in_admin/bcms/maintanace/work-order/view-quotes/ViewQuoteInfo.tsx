import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../../../shared/functions/Context";
import { useNavigate, useParams } from "react-router-dom";
import showModalFromId from "../../../../../shared/functions/ModalShow";
import DIALOG_NAMES from "../../../../dialogs/Dialogs";
import { getIconForExtensionExtra } from "../../../../shared/common";
import quoteIcon from "./assets/receipt_5924577.png";
import imagecon from "./assets/image_4606574.png";
import Loading from "../../../../../shared/components/Loading";

export const ViewQuoteInfo = observer(() => {
  const { store, api } = useAppContext();
  const me = store.user.meJson;
  const { maintenanceRequestId, workOrderId, id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const workOrder = store.maintenance.work_flow_order.getById(
    workOrderId || ""
  );

  const SP = workOrder?.asJson.quoteFiles.find((s) => s.id === id)?.id;

  const quoteInfo = workOrder?.asJson.quoteFiles.find((f) => f.id === id);

  const SPName = store.maintenance.servie_provider.all.find(
    (sp) => sp.asJson.id === SP
  )?.asJson.serviceProvideName;

  const back = () => {
    navigate(`/c/maintainance/request/${maintenanceRequestId}`);
  };

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      if (me?.property && maintenanceRequestId) {
        await api.maintenance.service_provider.getAll(me.property);
        await api.maintenance.work_flow_order.getAll(
          me.property,
          maintenanceRequestId
        );
      }
      setLoading(false);
    };
    getData();
  }, [
    api.maintenance.service_provider,
    api.maintenance.work_flow_order,
    maintenanceRequestId,
    me?.property,
  ]);

  const [imagesLoading, setImagesLoading] = useState(true);

  const handleImagesLoaded = () => {
    setImagesLoading(false);
  };
  return (
    <div className="uk-section leave-analytics-page">
      <div className="uk-container uk-container-large">
        <div className="section-toolbar uk-margin">
          <h4 className="section-heading uk-heading">
            Quotation Info ({SPName})
          </h4>
          <div className="controls">
            <div className="uk-inline">
              <button
                onClick={back}
                className="uk-button primary"
                type="button"
              >
                Back
              </button>
            </div>
          </div>
        </div>
        <div
          className="uk-child-width-1-6@m uk-grid-small uk-grid-match"
          data-uk-grid
        >
          <div>
            <a
              target="blank"
              style={{ cursor: "pointer" }}
              data-uk-tooltip="View quotation"
              href={quoteInfo?.quoteFileurl}
            >
              <div className="uk-card uk-card-default uk-card-body">
                <img src={quoteIcon} />
              </div>
            </a>
          </div>
        </div>
        <div
          className="uk-child-width-1-6@m uk-grid-small uk-grid-match"
          data-uk-grid
        >
          {imagesLoading && <Loading />}

          {quoteInfo?.imageUrls.map((img, index) => (
            <div key={index}>
              <div>
                <img
                  src={img}
                  alt={`Image ${index + 1}`}
                  onLoad={handleImagesLoaded}
                  style={{ display: imagesLoading ? "none" : "block" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});
