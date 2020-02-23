import React from 'react';
import './App.css';
import { Header, ElasticEnvironment } from './Header/Header';
import '@elastic/eui/dist/eui_theme_light.css';

function App() {
  let environments: ElasticEnvironment[] = [
    { url: "http://localhost:9200/", envName: "Local"}, 
    { url: "http://192.168.1.100:9200/", envName: "Dev"},
    { url: "http://localhost:9200/", envName: "UAT"}, 
    { url: "http://localhost:9200/", envName: "Live"} ];
  return (
    <Header defaultIndexName="family" elasticEnvironments={environments}></Header>
  );
}

export default App;
