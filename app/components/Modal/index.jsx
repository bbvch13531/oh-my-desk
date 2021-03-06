import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import Confirm from './Content/Confirm';
import DeleteConfirmWidget from './Content/DeleteConfirmWidget';
import MakeWebWidget from './Content/MakeWebWidget';
import './Modal.scss';

const propTypes = {
  modalType: PropTypes.string,
  modalProps: PropTypes.object, // eslint-disable-line
};

const defaultProps = {
  modalType: '',
  modalProps: {},
};

const content = {
  CONFIRM: Confirm,
  DELETE_CONFIRM_WIDGET: DeleteConfirmWidget,
  MAKE_WEB_WIDGET: MakeWebWidget,
};

class Modal extends React.Component {
  render() {
    const { modalType, modalProps } = this.props;
    const isOpen = !!modalType;
    const Content = content[modalType];

    if (!isOpen) {
      return null;
    }

    return (
      <ReactModal
        className="Modal__container"
        overlayClassName="Modal__overlay"
        contentLabel="Modal"
        isOpen={isOpen}
        ariaHideApp={false}
      >
        {<Content {...modalProps} />}
      </ReactModal>
    );
  }
}

Modal.propTypes = propTypes;
Modal.defaultProps = defaultProps;

export default Modal;
