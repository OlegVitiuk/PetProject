import { addGoal, removeGoal } from "actions/goalActions";
import { Icon, Input, Popover, Tag } from "antd";
import PaymentForm from "components/PaymentForm";
import * as React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { bindActionCreators, compose } from "redux";
import { Action } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "store";
import { IGoal } from "types/goal";
import { IGoalState } from "types/goal";
import styles from "./home.module.scss";

const { Search } = Input;

interface HomePageProps {
  goalsData: IGoalState;
  authorId: string;
}

interface HomePageState {}

interface LinkStateProps {
  goalsData: IGoalState;
  authorId: string;
}

interface LinkDispatchProps {
  addGoal: (goal: IGoal) => void;
  removeGoal: (id: string) => void;
}

type Props = HomePageProps & LinkDispatchProps;
type State = HomePageState & LinkStateProps;

class Home extends React.Component<Props, State> {
  public render() {
    const { goalsData } = this.props;

    const goalsIds = goalsData && Object.keys(goalsData);

    return (
      <div className={styles.homeWrapper}>
        <div className={styles.goalsHeader}>
          <h1 className={styles.homeHeader}>Add a goal</h1>
          <Search
            placeholder="Enter your goal"
            enterButton="Add"
            allowClear={true}
            size="large"
            onSearch={this.processGoal}
          />
        </div>
        <div className={styles.goalsContainer}>
          {goalsData &&
            goalsIds.map(goalId => {
              const goalData = goalsData[goalId];
              if (goalData) {
                return (
                  <div className={styles.goalCard} key={goalId}>
                    <div className={styles.goalHeader}>
                      <span className={styles.goalName}>{goalData.name}</span>
                      {this.renderPaidTag(goalData, goalId)}
                      <Icon
                        type="delete"
                        onClick={() => this.deleteGoal(goalId)}
                        className={styles.deleteIcon}
                      />
                    </div>
                    <Icon type="down-circle" className={styles.more} />
                  </div>
                );
              }
              return null;
            })}
          {!goalsData && <span className={styles.noData}>No data</span>}
        </div>
      </div>
    );
  }
  private renderPaidTag = (goalData: IGoal, goalId: string) => {
    const { authorId, name, paid } = goalData;

    if (paid) {
      return (
        <Tag key={authorId} color="green">
          paid
        </Tag>
      );
    }
    return (
      <Popover content={<PaymentForm goalId={goalId} goalName={name} />}>
        <Tag key={authorId} color="red">
          not paid
        </Tag>
      </Popover>
    );
  };

  private processGoal = (value: string): void => {
    const { addGoal, authorId } = this.props;

    addGoal({
      name: value,
      paid: false,
      price: 100,
      authorId
    });
  };

  private deleteGoal = (id: string): void => {
    const { removeGoal } = this.props;

    removeGoal(id);
  };
}

export default compose<any>(
  connect(
    (state: AppState): LinkStateProps => ({
      goalsData: state.firestore.data.Goals,
      authorId: state.firebase.auth.uid
    }),
    (dispatch: ThunkDispatch<any, any, Action>): LinkDispatchProps => ({
      addGoal: bindActionCreators(addGoal, dispatch),
      removeGoal: bindActionCreators(removeGoal, dispatch)
    })
  ),
  firestoreConnect((props: any) => {
    return [
      { collection: "Goals", where: [["authorId", "==", props.authorId]] }
    ];
  })
)(Home);
