import React, { Component } from 'react';
import { EuiHeader, EuiHeaderSectionItem, EuiHeaderLogo, EuiComboBox, EuiFormRow, EuiDatePicker } from '@elastic/eui';
import moment, { Moment } from 'moment';
import { EuiFlexGroup } from '@elastic/eui';
import { EuiFlexItem } from '@elastic/eui';
import { EuiButton } from '@elastic/eui';

import {getIndices, getClusterHealth} from '../Service/ElasticSearchService'
import './Header.css';
import { ButtonColor } from '@elastic/eui';

export interface ElasticEnvironment { url: string, envName: string }
interface HeaderProps { defaultIndexName: string, elasticEnvironments: ElasticEnvironment[] };
interface HeaderState { indices: { label: string; }[], 
                        selectedIndex: { label: string; }[], 
                        selectedDate: Moment, 
                        clusterHealth: { fillcolor: ButtonColor, color: string, status: string },
                        environments: { label: string; }[],
                        selectedEnvironment: { label: string; }[]
                        elasticUrl: string
                     };

export class Header extends Component<HeaderProps, HeaderState>{

    elasticFallBackUrl = "http://localhost:9200/";
    constructor(props: HeaderProps) {
        super(props);
        this.state = { 
                       indices: [],
                       selectedIndex: [] = [{ label: props.defaultIndexName }],
                       selectedDate: moment(), 
                       clusterHealth: { fillcolor:"primary", color: "subdued", status:"Unknown" },
                       environments: [] = [ {label: "Local"}, {label: "Dev"}, {label: "UAT"}, {label: "Live"}],
                       selectedEnvironment: [] = [{ label: "Local" }],
                       elasticUrl: this.elasticFallBackUrl                       
                 };
      }

    async componentDidMount()
    {        
        await this.setIndices();
        await this.setClusterHealth(); 
        this.setEnvironments();
        
    }

    setEnvironments(){
        if(this.props.elasticEnvironments && this.props.elasticEnvironments.length > 0) {
            let envs: {label: string}[] = [];
            this.props.elasticEnvironments.forEach(env => {
                    envs.push({label: env.envName});
            });

            this.setState({environments: envs });
        }
        else{
            this.setState({environments: [ {label: "Local"}, {label: "Dev"}, {label: "UAT"}, {label: "Live"}]});
        }
    }

    async setIndices()
    {
        let result = await getIndices(this.state.elasticUrl); 
        if(result){
            let indexes: { label: string; }[] = [];
            result.forEach((index) => {
                indexes.push( { label: index});
            })
              
            this.setState({indices: indexes});

            if(indexes && indexes.length > 0 && this.props.defaultIndexName.length <= 0) {
                this.setState({selectedIndex: [{ label: indexes[0].label }] });
            }
        }
    }

    async setClusterHealth()
    {
        let health = await getClusterHealth(this.state.elasticUrl);
        switch(health?.toLowerCase())
        {
           case "Green".toLowerCase():
               {
                   this.setState({clusterHealth: { fillcolor: "secondary" , color: health, status: "Healthy" }});
                   break;
               }
           case "Yellow".toLowerCase():
               {
                   this.setState({clusterHealth: { fillcolor: "warning" , color: health, status: "Warning" }});
                   break;
               }
           case "Red".toLowerCase():
               {
                   this.setState({clusterHealth: { fillcolor: "danger" , color: health, status: "Failure" }});
                   break;
               }
            default:
                {
                    this.setState({clusterHealth: { fillcolor: "primary" ,color: "subdued", status: "Unknown" }});
                    break;
                }
        }
    }

    onIndexChange = (index: any) =>
    {
        this.setState({
            selectedIndex: index,
          });
    }

    onDateChange = (date: any) =>
    {
        this.setState({
            selectedDate: date,
          });
    }

    onEnvironmentChange = (environment: any) =>
    {
        this.setState({
            selectedEnvironment: environment,
          });
       
        let elasticEnv = this.props.elasticEnvironments.find(env => env.envName == environment[0].label);
        let url = elasticEnv ? elasticEnv.url : this.elasticFallBackUrl;

        this.setState({
            elasticUrl: url,
          });
    }

    render(){        
        return(
          <EuiHeader>
            <EuiHeaderSectionItem border="none">
              <EuiHeaderLogo>Elastic Log Viewer</EuiHeaderLogo>
            </EuiHeaderSectionItem>
            <EuiComboBox className="headermargins5px"
                singleSelection={{ asPlainText: true }}
                options={this.state.indices}
                selectedOptions={this.state.selectedIndex}                
                onChange={this.onIndexChange}
                isClearable={false}
            />
            <EuiFormRow className="headermargins2px">
                <EuiDatePicker 
                    selected={this.state.selectedDate}
                    onChange={this.onDateChange}
                />
            </EuiFormRow>
            <EuiFlexGroup className="elasticsearchdetails" gutterSize="none">               
                <EuiFlexItem grow={false}>
                    <EuiComboBox className="elasticsearchhealth"
                                singleSelection={{ asPlainText: true }}
                                options={this.state.environments}
                                selectedOptions={this.state.selectedEnvironment}                
                                onChange={this.onEnvironmentChange}
                                isClearable={false}
                                
                    />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiButton fill color={this.state.clusterHealth.fillcolor} target="_blank"
                               className="headermargins2px" iconType="link" href={this.state.elasticUrl}>{this.state.elasticUrl}</EuiButton>
                </EuiFlexItem>
            </EuiFlexGroup>
          </EuiHeader>
          
          );
    }
}