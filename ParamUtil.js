/**
 * 
 * @class ParamUtil 
 * */
class ParamUtil 
{
  /**
     * @memberOf ParamUtil
     * @function LoadParameter
     * @description Implements ParamUtil.LoadParameter to add possible values to a string response parameter
     *
     * @example
     * [{Code: "1", Label: "Answer 1"}, {Code: "2", Label: "Answer 2"}]
     * 
     * //returns nothing
     *
     * @param {Object} param - the Reportal scripting report object
     * @param {Object} param - the parameter the possible values will be added to
     * @param {Array}  parameter_values - an array of objects with a property Code and a property Label.
     * @return - returns nothing
     */

  static function LoadParameter (report, parameter, parameter_values) 
  {
    for (var i=0; i<parameter_values.length; ++i) 
    {   
      var a : ParameterValueResponse = new ParameterValueResponse(); 
      var code = (parameter_values[i].Code == null) ? parameter_values[i].Label : parameter_values[i].Code;
      a.StringKeyValue = code;
      
      var labels : LanguageTextCollection = new LanguageTextCollection(); 
      labels.Add(new LanguageText(report.CurrentLanguage, parameter_values[i].Label)); 
      
      a.LocalizedLabel = new Label(labels);
      a.StringValue = parameter_values[i].Label;
      
      parameter.Items.Add(a);
    }
  }
 
  
  static function ClearParameters(state, clear_parameters) {
    for (var i=0; i<clear_parameters.length; ++i)
      state.Parameters[ clear_parameters[i] ] = null;    
  }
 

  static function Selected(report, state, parameterName, log)
  {
    var paramValues = ParamLists.Get(parameterName, state, report); //ParameterList(report, dataSourceNodeId, parameterName, state);
    var currentCode = GetParamCode(state, parameterName,log);
//log.LogDebug('currentCode=[' + currentCode + ']');
    for(var i = 0; i < paramValues.length; i++)
    {
//log.LogDebug(paramValues[i].Code + ' = ' + currentCode)
      if(paramValues[i].Code == currentCode)
        return paramValues[i];    
    }
  }
  
  
    static function HideOptions(state, param_name) {
      
      	var is_question_selected = (ParamUtil.GetParamCode(state, param_name) != null);
      	var is_show_all_selected = (ParamUtil.GetParamCode(state, param_name + '_options') == '1');
      	var hide = !is_question_selected || is_show_all_selected;
      
        return hide;
    }
        
  
	static function Save (state, report, param_name, value) {

		var a : ParameterValueResponse = new ParameterValueResponse();	
		a.StringKeyValue = value;

		var lbls : LanguageTextCollection = new LanguageTextCollection(); 
		lbls.Add(new LanguageText(report.CurrentLanguage, value)); 
		a.LocalizedLabel = new Label(lbls);
		a.StringValue = value;

		state.Parameters[param_name] = a;

	}  
  
  
  // Summary:
  // GetParamCode is used to get the current code value of a given string response parameter
  // where the string response parameter has an associated list of selectable items.
  //
  // Parameter inputs:
  //   * state - The Reportal scripting state object.
  //   * parameter_name - The name of the string response parameter to get the value from.
  // Returns:
  //   * The string code value of the given parameter. If the parameter does not have a string
  //     code value null is returned.
  //
  static function GetParamCode (state, parameter_name,log)
  {
//    log.LogDebug('entered param code');
//    log.LogDebug('parameter_name=[' + parameter_name + ']');
//    log.LogDebug('state.Parameters.IsNull(parameter_name)=[' + state.Parameters.IsNull(parameter_name) + ']');
    if (state.Parameters.IsNull(parameter_name)) 
      return null;
    
//    log.LogDebug('state.Parameters.IsNull(parameter_name)=[' + state.Parameters.IsNull(parameter_name) + ']');
    
    var pvr : ParameterValueResponse = state.Parameters[parameter_name];
   
    return pvr.StringKeyValue;
  }
 

  // Summary:
  // GetParamCodes is used to get the code values of a given multi select parameter.
  //
  // Parameter inputs:
  //   * state - The Reportal scripting state object.
  //   * parameter_name - The name of the string response multi select parameter to get the 
  //     value from.
  // Returns:
  //   * An array of string values with the selected items of the multi select parameter passed
  //     in the the function. If no string values are selected an empty array is returned.
  //
  static function GetParamCodes (state, parameter_name)
  {
    var p : ParameterValueMultiSelect = state.Parameters[parameter_name];
    var o = [];
    if (p != null) 
    {
      for (var enumerator : Enumerator = new Enumerator(p) ; !enumerator.atEnd(); enumerator.moveNext())
      {
        var pvr : ParameterValueResponse = enumerator.item();
        o.push (pvr.StringKeyValue);
      }
    }
  
    return o;
  }
  
  static function Contains (state, parameter_name, code) {
  	var codes =  GetParamCodes (state, parameter_name);
    for (var i=0; i<codes.length; ++i)
      	if (codes[i].toUpperCase() == code.toUpperCase())
          	return true;

    return false;
  }
  

  static function GetByCode(report, state, parameterName, code)
  {
    var paramValues = ParamLists.Get(parameterName, state, report); 
    for(var i = 0; i < paramValues.length; i++)
    {
      if(paramValues[i].Code == code)
        return paramValues[i];    
    }
  }
}