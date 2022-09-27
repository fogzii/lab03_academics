/**
 * NOTE: The only functions that you should write tests for are those defined
 * in the specification's interface (README.md). 
 * 
 * Your dataStore or any "helper" function you define should NOT be imported or
 * tested - your tests must work even if it is run against another student's
 * solution to this lab.
 */

import {
  academicCreate,
  courseCreate,
  academicDetails,
  courseDetails,
  academicsList,
  coursesList,
  courseEnrol,
  clear,
} from './academics';

test('Remove this test and uncomment the sample tests further below', () => {
  expect(1 + 1).toEqual(2);
});

/*

// FIXME
// This is a sample test that tests many academic functions together
// You may want to break this up into multiple tests.
describe('Sample test', () => {
  test('error creating academics', () => {
    // Each test should be independent of other tests. This can be achieve by
    // clearing and reinitialising the database.
    // You may want to look at Jest's beforeEach and afterEach.
    clear();

    // Empty name
    expect(academicCreate('', 'dancing')).toStrictEqual({ error: expect.any(String) });
  });

  test('correct return type', ()=> {
    // Consider beforeEach
    clear();

    const academic = academicCreate('Magnus', 'chess');

    // NOTE: We don't actually know what the generated ID should be
    expect(academic).toStrictEqual(
      {
        academicId: expect.any(Number),
      }
    );

    // However, we can still use this ID in other functions
    expect(academicDetails(academic.academicId, academic.academicId)).toStrictEqual({
      academic: {
        academicId: academic.academicId,
        name: 'Magnus',
        hobby: 'chess',
      }
    });

    // Note the different key for "name" in this function - refer to "Data Types"
    // When comparing arrays with multiple items, you may want to convert each
    // array into a Set (since we don't know which order the items will be in).
    expect(academicsList(academic.academicId)).toStrictEqual({
      academics: [
        {
          academicId: academic.academicId,
          academicName: 'Magnus',
        }
      ]
    });
  });
});

*/
