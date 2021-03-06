import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import SettingContainer from 'containers/SettingContainer';
import WidgetSettingContainer from 'containers/WidgetSettingContainer';
import WidgetStore from 'components/WidgetStore';
import GNBWrapper from 'components/GlobalNavigationBar/GNBWrapper';
import App from '../app';

function routes() {
  return (
    <App>
      <Switch>
        <Route path="/setting" component={SettingContainer} />
        <Route path="/widget-list" component={WidgetSettingContainer} />
        <Route path="/widget-store" component={GNBWrapper(WidgetStore)} />
        <Redirect to="/widget-list" from="/" />
      </Switch>
    </App>
  );
}

export default routes;
