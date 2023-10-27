import { observer } from "mobx-react-lite";
import { useState, FormEvent } from "react";
import { useAppContext } from "../../../../shared/functions/Context";
import { hideModalFromId } from "../../../../shared/functions/ModalShow";
//import { IRequestType, defaultRequestType } from "../../../../shared/models/maintenance/request/maintenance-request/types/RequestTypes";
import DIALOG_NAMES from "../../Dialogs";
import { IWorkOrderFlow, defaultMaintenanceworkOrder } from "../../../../shared/models/maintenance/request/work-order-flow/WorkOrderFlow";
import { IServiceProvider, defaultServiceProvider } from "../../../../shared/models/maintenance/service-provider/ServiceProviderModel";
import { useParams } from "react-router-dom";
import SingleSelect from "../../../../shared/components/single-select/SlingleSelect";

export const WorkOrderFlowDialog = observer(() => {
  const { api, store, ui } = useAppContext();
  const [loading, setLoading] = useState(false);
  const me = store.user.meJson;
  const {maintenanceRequestId} = useParams();
  const currentDate = new Date();
  const [provider,setProvider] = useState<IServiceProvider>({
    ...defaultServiceProvider,
  })

  const [workOrder, setWorkOrder] =
    useState<IWorkOrderFlow>({
      ...defaultMaintenanceworkOrder,
    });

    const serviceproviders = store.maintenance.servie_provider.all
    .map((u) => {
      return {
        value: u.asJson.id,
        label: u.asJson.serviceProvideName ,
      };
    });


  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!me?.property) return;
    // Update API

    if (maintenanceRequestId){
    try {
      if (store.maintenance.work_flow_order.selected) {
       
        const deptment = await api.maintenance.work_flow_order.update(
            workOrder,
            maintenanceRequestId,
          me.property
        );
        await store.maintenance.work_flow_order.load();
        ui.snackbar.load({
          id: Date.now(),
          message: "Work Order updated!",
          type: "success",
        });
      
      } else {
        // maintenanceRequest.authorOrSender = me.uid;
        //requestType.dateRequested = currentDate.toLocaleTimeString();

        await api.maintenance.work_flow_order.create(
          workOrder,
          maintenanceRequestId,
          me.property
        );
        ui.snackbar.load({
          id: Date.now(),
          message: "Work Order created!",
          type: "success",
        });
      }
    } catch (error) {
      ui.snackbar.load({
        id: Date.now(),
        message: "Error! Failed to update Work Order.",
        type: "danger",
      });
    
    }

    store.maintenance.work_flow_order.clearSelected();
    setWorkOrder({...defaultMaintenanceworkOrder,
    });
    setLoading(false);
    hideModalFromId(DIALOG_NAMES.MAINTENANCE.CREATE_WORK_ORDER);
  };
  }


  function handleSelectChange(value: string): void {
   workOrder.serviceProviderId = value;
  }

//   useEffect(() => {
//     if (store.maintenance.requestType.selected)
//     setRequestType(store.maintenance.maintenance_request.selected);
//     else setRequestType({ ...defaultMaintenanceRequest });

//     return () => {};
//   }, [store.maintenance.maintenance_request.selected]);

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Work Order</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <form className="uk-form-stacked" onSubmit={onSave}>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Title 
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-small"
                  type="text"
                  placeholder="Title"
                  value={workOrder.title}
                  onChange={(e) =>
                    setWorkOrder({
                      ...workOrder,
                      title: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Description 
              </label>
              <div className="uk-form-controls">
                <input
                  className="uk-input uk-form-controls"
                  type="text"
                  placeholder="Description"
                  value={workOrder.description}
                  onChange={(e) =>
                    setWorkOrder({
                      ...workOrder,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="uk-margin">
              {/*serviceproviders*/}
              <label className="uk-form-label" htmlFor="form-stacked-text">
                Service Providers 
              </label>
              <div className="uk-form-controls">
                <SingleSelect
                  // className=""
                  // type=""
                  options={serviceproviders}
                  onChange={(e)=>
                  setProvider({...provider, })
                  }
                  value={workOrder.serviceProviderId}
                  required
                />
              </div>
            </div>
            <div className="footer uk-margin">
              <button className="uk-button secondary uk-modal-close">
                Cancel
              </button>
              <button className="uk-button primary" type="submit">
                Save
                {loading && <div data-uk-spinner="ratio: .5"></div>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});
