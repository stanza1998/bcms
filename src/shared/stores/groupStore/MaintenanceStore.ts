import AppStore from "../AppStore";
import MaintenanceRequestStore from "../individualStore/maintenance/request/maintenance-request/MaintenanceRequestStore";
import RequestTypeStore from "../individualStore/maintenance/request/maintenance-request/RequestType/RequestTypeStore";
import WorkOderFlowStore from "../individualStore/maintenance/request/work-order-flow/WorkOrderFlowStore";
import ServiceProviderStore from "../individualStore/maintenance/service-provider/ServiceProviderStore";

export default class MaintenanceStore {
    servie_provider: ServiceProviderStore;
    maintenance_request: MaintenanceRequestStore;
    work_flow_order: WorkOderFlowStore;
    requestType: RequestTypeStore;

    constructor(store: AppStore) {
        this.servie_provider = new ServiceProviderStore(store);
        this.maintenance_request = new MaintenanceRequestStore(store);
        this.work_flow_order = new WorkOderFlowStore(store);
        this.requestType = new RequestTypeStore(store);
    }
}