interface IProps {
  onDelete: (e: any, id: string) => void;
  loading: boolean;
  id?: string;
}

export const DeleteConfirm = (props: IProps) => {
  const { onDelete, loading, id } = props;

  return (
    <div className="uk-modal-dialog uk-modal-body uk-margin-auto-vertical confirm-delete-dialog">
      <button
        className="uk-modal-close-default"
        type="button"
        data-uk-close
      ></button>
      <h3 className="uk-modal-title">Delete Permanently?</h3>
      <div className="dialog-content uk-position-relative">
        <div className="reponse-form">
          <div className="footer uk-margin">
            <button className="uk-button uk-button-primary uk-modal-close">
              Cancel
            </button>
            <button
              className="uk-button danger"
              onClick={(e) => onDelete(e.stopPropagation(), id!)}
            >
              Delete
              {loading && <div data-uk-spinner="ratio: .5"></div>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
