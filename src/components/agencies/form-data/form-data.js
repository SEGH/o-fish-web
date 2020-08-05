import React, { Component } from 'react';
import NewDialog from "./new-dialog.js";

import SearchIcon from "@material-ui/icons/Search";
import { withTranslation } from "react-i18next";
import "./form-data.css";

import CustomMenuService from "./../../../services/custom-menu.service";

const menuService = CustomMenuService.getInstance();

class AgencyFormData extends Component {
  state = {
    dialogDisplayed : false,
    menuId: null,
    activeItem: "activities",
    menuItems: {
      "activities": {title: "Activities", btn: "Add activity", data: []},
      "species": {title: "Species", btn: "Add species", data:  []},
      "gear": {title: "Gear Types", btn: "Add gear type", data:  []},
      "fisheries": {title: "Catches", btn: "Add catch", data:  []},
      "emsTypes": {title: "EMS", btn: "Add EMS", data:  []},
      "ports": {title: "Vessel flags", btn: "Add vessel flag state", data:  []},
      "violationCodes": {title: "Violation Codes", btn: "Add code", data:  []},
      "violationDescriptions": {title: "Violation Descriptions", btn: "Add description", data:  []}
    }
  }

  showDialog = () => {
    this.setState({
      dialogDisplayed: true
    })
  }

  saveData = () => {
      const { menuItems, activeItem, menuId } = this.state;
      const item = menuItems[activeItem];
      const data = {_id: menuId, $set: { }}
      data["$set"][activeItem] = item.data;
      /*
      menuService.updateMenus(data).then((result)=>{
        console.log(result);
      }).catch((err)=>{

      });*/
  }

  dialogClosed = (items) => {
    const { menuItems, activeItem } = this.state;
    const item = menuItems[activeItem];
    if (items && item){
      item.data = item.data.concat(items);
      this.setState({
        menuItems: menuItems,
        dialogDisplayed: false
      })
    } else {
      this.setState({
        dialogDisplayed: false
      })
    }
  }

  changeCurrentTab = (tab) => {
    this.setState({activeItem: tab});
  }

  componentDidMount(){
    const { menuItems } = this.state;
    if (this.props.agency && this.props.agency.name){
      menuService.getMenus(this.props.agency.name).then((menuData)=>{
        for (const key in menuData){
          if (menuItems[key]){
            menuItems[key].data = menuData[key];
          }
        }
        this.setState({
          menuItems: menuItems,
          menuId: menuData._id
        })
      })
    }
  }

  render() {

    const { menuItems, dialogDisplayed, activeItem } = this.state;
    const { t, agency } = this.props;

    const item = menuItems[activeItem];

    return <div className="agency-form-data flex-row full-view">
      <div className="flex-column justify-between form-content-menu">
        <div onClick={()=>this.changeCurrentTab("activities")} className={"form-menu-item" + (activeItem == "activities" || activeItem ==  "gear" || activeItem ==  "fishery" ? " active-form-menu-item": "")}>
          Activity
        </div>
        <div onClick={()=>this.changeCurrentTab("activities")} className={"form-menu-item sub-item" + (activeItem == "activities" ? " active-form-menu-item": "")}>
          Activity
        </div>
        <div onClick={()=>this.changeCurrentTab("species")} className={"form-menu-item sub-item" + (activeItem == "species" ? " active-form-menu-item": "")}>
          Fishery
        </div>
        <div onClick={()=>this.changeCurrentTab("gear")} className={"form-menu-item sub-item" + (activeItem == "gear" ? " active-form-menu-item": "")}>
          Gear
        </div>
        <div onClick={()=>this.changeCurrentTab("fisheries")} className={"form-menu-item" + (activeItem == "fisheries" ? " active-form-menu-item": "")}>
          Catch
        </div>
        <div onClick={()=>this.changeCurrentTab("emsTypes")} className={"form-menu-item" + (activeItem == "emsTypes" ? " active-form-menu-item": "")}>
          EMS
        </div>
        <div onClick={()=>this.changeCurrentTab("ports")} className={"form-menu-item" + (activeItem == "ports" ? " active-form-menu-item": "")}>
          Vessel flag State
        </div>
        <div onClick={()=>this.changeCurrentTab("violationCodes")} className={"form-menu-item" + (activeItem == "violationCodes" ? " active-form-menu-item": "")}>
          Violation Codes
        </div>
        <div onClick={()=>this.changeCurrentTab("violationDescriptions")} className={"form-menu-item" + (activeItem == "violationDescriptions" ? " active-form-menu-item": "")}>
          Violations Descriptions
        </div>
      </div>
      <div className="flex-column form-content form-search">
        <div className="flex-row justify-between align-center form-search-panel">
          <div>
            <h3>{item.data.length + ' ' + item.title} </h3>
          </div>
          <div className="form-search-field">
              <div className="search-icon">
                <SearchIcon />
              </div>
              <input
                className="search-field"
                type="search"
                placeholder="Search Species"
              ></input>
          </div>
          <button className="blue-btn" onClick={this.showDialog}>
            {item.btn}
          </button>
        </div>
        <div className="form-checkbox-list">
          {item
            ? item.data.map((item, ind) => (
                <div
                  className="flex-row align-center form-info-box"
                  key={ind}
                >
                  <input className="check-item" type="checkbox" />
                  {item}
                </div>
              ))
            : "NO " + item.title }
        </div>
      </div>
      {dialogDisplayed && <NewDialog onApply={this.dialogClosed} title={item.title} lineText={item.btn}></NewDialog>}
    </div>;
  }
}

export default withTranslation("translation")(AgencyFormData);
