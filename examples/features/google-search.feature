@search
Feature: Searching for vote cards app
  As an internet user
  In order to find out more about the itunes vote cards app
  I want to be able to search for information about the itunes vote cards app
  
  Scenario: Google search for vote cards app
    When I search Google for "itunes vote cards app"
    Then I should see "Vote Cards" in the results

  Scenario: Google search for course of life app
    When I search Google for "CourseOf.Life"
    Then I should see some results