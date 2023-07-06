import React, { Fragment } from "react";

export class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { error: null, errorInfo: null };
    this.handleReload = this.handleReload.bind(this);
  }

  handleReload() {
    window.location.reload();
  }
  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <Fragment>
          <div className="uk-section uk-section-small">
            <div className="uk-container uk-container-xlarge">
              <div className="error-boundary uk-alert-danger" data-uk-alert>
                <a href="void(0)" className="uk-alert-close" data-uk-close></a>
                <p className="title">Something went wrong.</p>
                <button className="btn-text" onClick={this.handleReload}>
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      );
    }
    return <Fragment>{this.props.children}</Fragment>;
  }
}

export default ErrorBoundary;
