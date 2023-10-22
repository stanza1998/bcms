import AppStore from "../stores/AppStore";
import AppApi from "./AppApi";
import MaintenanceRequestApi from "./maintenance/request/maintenance-request/Maintenance";
import RequestTypeApi from "./maintenance/request/maintenance-request/RequesrType/RequestType";
import WorkOderFlowApi from "./maintenance/request/work-flow-order-request/WorkOrderFlow";
import ServiceProviderApi from "./maintenance/service-provider/ServiceProviderAPi";

export default class MaintenanceApi {
    maintenance_request: MaintenanceRequestApi;
    request_type: RequestTypeApi;
    work_flow_order: WorkOderFlowApi;
    service_provider: ServiceProviderApi;

    constructor(api: AppApi, store: AppStore) {
        this.maintenance_request = new MaintenanceRequestApi(api, store);
        this.request_type = new RequestTypeApi(api, store);
        this.work_flow_order = new WorkOderFlowApi(api, store);
        this.service_provider = new ServiceProviderApi(api, store);
    }
}