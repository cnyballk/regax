import React, { Component, createContext } from 'react';
import equal from 'fast-deep-equal';

const mContext = createContext();

//////////////// Hoc orm  ===>  {state,contro}
export const orm = (mapState, mapMethods) => WarpperComponent =>
  class extends Component {
    constructor(props) {
      super(props);
      this._isMounted = false;
      this.state = { stateProps: {} };
      this.updata = this.updata.bind(this);
      this.methodsProps = {};
    }
    componentDidMount() {
      if (!this.store) throw Error('Please be wrapped in a <Provider/>');
      this._isMounted = true;
      this.ormMethodsToProps();
      this.updata();
      this.store.listen(this.updata);
    }
    componentWillUnmount() {
      this._isMounted = false;
      this.store.unListen(this.updata);
    }
    updata() {
      const stateProps = mapState(this.store.state);
      !equal(this.state.stateProps, stateProps) &&
        this.setState({ stateProps });
    }
    ormMethodsToProps() {
      this.methodsProps = mapMethods(this.store.methods);
    }
    render() {
      const { stateProps } = this.state;
      return (
        <mContext.Consumer>
          {context => {
            this.store = context;
            return <WarpperComponent {...stateProps} {...this.methodsProps} />;
          }}
        </mContext.Consumer>
      );
    }
  };

////////////////////////////////////////////////

////////////////Provider
export class Provider extends Component {
  render() {
    return (
      <mContext.Provider value={this.props.store}>
        {this.props.children}
      </mContext.Provider>
    );
  }
}
