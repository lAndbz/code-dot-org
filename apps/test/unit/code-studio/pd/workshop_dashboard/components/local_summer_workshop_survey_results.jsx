import LocalSummerWorkshopSurveyResults from '@cdo/apps/code-studio/pd/workshop_dashboard/local_summer_workshop_survey_results';
import {shallow, mount} from 'enzyme';
import {expect} from 'chai';
import sinon from 'sinon';
import React from 'react';

describe("Local Summer Workshop Management", () => {
  const getFakeSurveyData = () => {
    return {
      facilitator_breakdown: false,
      this_workshop: {
        'venue_feedback': ['Feedback 1', 'Feedback 2'],
        'num_enrollments': '10',
        'num_surveys': '8',
        'received_clear_communication': '5.5',
        'how_much_learned': '4.5'
      },
      all_my_local_workshops: {
        'venue_feedback': ['Feedback 1', 'Feedback 2', 'Feedback 3', 'Feedback 4'],
        'num_enrollments': '200',
        'num_surveys': '180',
        'received_clear_communication': '5.5',
        'how_much_learned': '4.5'
      }
    };
  };

  describe("View summarization", () => {
    it("Spinner displayed initially", () => {
      let localSummerWorkshopSurveyResults = shallow(
        <LocalSummerWorkshopSurveyResults
          params={{workshopId: '1', facilitators: []}}
        />
      );

      expect(localSummerWorkshopSurveyResults.state('loading')).to.be.true;
      expect(localSummerWorkshopSurveyResults.find('Spinner')).to.have.length(1);
    });

    it("Table gets displayed after loading is completed", () => {
      let server = sinon.fakeServer.create();
      server.respondWith(
        'GET',
        '/api/v1/pd/workshops/1/local_workshop_survey_report',
        [200, {"Content-Type": "application/json"}, JSON.stringify(getFakeSurveyData())]
      );

      let localSummerWorkshopSurveyResults = mount(
        <LocalSummerWorkshopSurveyResults
          params={{workshopId: '1', facilitators: []}}
        />
      );

      server.respond();

      expect(server.requests.length).to.equal(1);
      expect(localSummerWorkshopSurveyResults.state('loading')).to.be.false;
      expect(localSummerWorkshopSurveyResults.find('table')).to.have.length(1);
      expect(localSummerWorkshopSurveyResults.find('table th')).to.have.length(3);

      expect(localSummerWorkshopSurveyResults.find('.well')).to.have.length(5);
      expect(localSummerWorkshopSurveyResults.find('.well li')).to.have.length(2);
    });
  });
});
