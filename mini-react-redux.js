/////////////////////////////////////
// Mini React Redux implementation //
/////////////////////////////////////

export class Provider extends React.Component { 
    getChildContext() {
        return {
            store: this.props.store
        };
    }
    render() {
        return this.props.children;
    }
}

Provider.childContextTypes = {
    store: PropTypes.object
};

export const connect = (
    mapStateToProps = () => ({}),
    mapDispatchToProps = () => ({})
) => Component => {
    class Connected extends React.Component {
        onStoreOrPropsChange(props) {
            const {store} = this.context;
            const state = store.getState();
            const stateProps = mapStateToProps(state, props);
            const dispatchProps = mapDispatchToProps(store.dispatch, props);
            this.setState({
                ...stateProps,
                ...dispatchProps
            });
        }
        componentWillMount() {
            const {store} = this.context;
            this.onStoreOrPropsChange(this.props);
            this.unsubscribe = store.subscribe(() => this.onStoreOrPropsChange(this.props));
        }
        componentWillReceiveProps(nextProps) {
            this.onStoreOrPropsChange(nextProps);
        }
        componentWillMount() {
            this.unsubscribe();
        }
        render() {
            return <Component {...this.props} {...this.state}/>
        }
    }

    Connected.contextTypes = {
        store: PropTypes.object
    };

    return Connected;
}