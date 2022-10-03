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

// resets database before each test
beforeEach(() => clear());

// begin tests
describe('Functions that create/add items', () => {

  test('successful creation of an academic', () => {
    expect(academicCreate('Justin', 'pole dancing')).toStrictEqual(
      { 
        academicId: expect.any(Number),
      }
    );
  });
  
  test('unsuccessful creation of an academic due to empty name', () => {
    expect(academicCreate('', 'pole dancing')).toStrictEqual({ error: expect.any(String) });
  });

  test('unsuccessful creation of an academic due to empty hobby', () => {
    expect(academicCreate('Justin', '')).toStrictEqual({ error: expect.any(String) });
  });

  test('unsuccessful creation of an academic due to empty name & hobby', () => {
    expect(academicCreate('', '')).toStrictEqual({ error: expect.any(String) });
  });

  test('successful creation of a course', ()=> { // check ater that creator is staff and member
    const academic = academicCreate('Justin', 'pole dancing');
    expect(courseCreate(academic.academicId, 'POLE1101', 'pole dancing fundamentals')).toStrictEqual(
      {
        courseId: expect.any(Number),
      }
    );
  });

  test('unsuccessful creation of a course due to invalid id', ()=> {
    expect(courseCreate(777, 'POLE1101', 'pole dancing fundamentals')).toStrictEqual({ error: expect.any(String) });
  });

  test('unsuccessful creation of a course due to invalid name', ()=> {
    const academic = academicCreate('Justin', 'pole dancing');
    expect(courseCreate(academic.academicId, 'POLEDANCING1101', 'pole dancing fundamentals')).toStrictEqual({ error: expect.any(String) });
    expect(courseCreate(academic.academicId, '', '')).toStrictEqual({ error: expect.any(String) });
  });

  test('successful course enrolment as member', ()=> {
    const academic = academicCreate('Justin', 'pole dancing');
    const academic2 = academicCreate('Peter', 'tutoring');
    const course = courseCreate(academic.academicId, 'POLE1101', 'pole dancing fundamentals');

    courseEnrol(academic2.academicId, course.courseId, false);
    expect(courseDetails(academic.academicId, course.courseId).allMembers).toStrictEqual({
      course: {
        courseId: course.courseId,
        name: 'POLE1101',
        description: 'pole dancing fundamentals',
        allMembers: [academicDetails(academic.academicId, academic.academicId), academicDetails(academic2.academicId, academic2.academicId)],
        staffMembers: [academicDetails(academic.academicId, academic.academicId)],
      }
    });
  });

  test('successful course enrolment as staff', ()=> {
    const academic = academicCreate('Justin', 'pole dancing');
    const academic2 = academicCreate('Peter', 'tutoring');
    const course = courseCreate(academic.academicId, 'POLE1101', 'pole dancing fundamentals');

    courseEnrol(academic2.academicId, course.courseId, true);
    expect(courseDetails(academic.academicId, course.courseId).allMembers).toStrictEqual({
      course: {
        courseId: course.courseId,
        name: 'POLE1101',
        description: 'pole dancing fundamentals',
        allMembers: [academicDetails(academic.academicId, academic.academicId)],
        staffMembers: [academicDetails(academic.academicId, academic.academicId), academicDetails(academic2.academicId, academic2.academicId)],
      }
    });
  });

  test('unsuccessful course enrolment', ()=> {
    const academic = academicCreate('Justin', 'pole dancing');
    const academic2 = academicCreate('Peter', 'tutoring');
    const course = courseCreate(academic.academicId, 'POLE1101', 'pole dancing fundamentals');
    courseEnrol(academic2.academicId, course.courseId, false);

    // invalid academicId
    expect(courseEnrol(academic2.academicId + 1, course.courseId, true)).toStrictEqual({ error: expect.any(String) });

    // invalid courseId
    expect(courseEnrol(academic2.academicId, course.courseId + 1, true)).toStrictEqual({ error: expect.any(String) });

    // academic is staff already
    expect(courseEnrol(academic.academicId, course.courseId, true)).toStrictEqual({ error: expect.any(String) });

    // academic is member already
    expect(courseEnrol(academic2.academicId, course.courseId, false)).toStrictEqual({ error: expect.any(String) });
    expect(courseEnrol(academic2.academicId, course.courseId, true)).toStrictEqual({ error: expect.any(String) });
  });
});

describe('Functions that request details', () => {
  test('successful academic return', ()=> {
    const academic = academicCreate('Justin', 'pole dancing');
    expect(academicDetails(academic.academicId, academic.academicId)).toStrictEqual({
      academic: {
        academicId: academic.academicId,
        name: 'Justin',
        hobby: 'pole dancing', 
      }
    });
  });

  test('unsuccessful academic return', ()=> {
    // invalid academicId and academicToViewId
    expect(academicDetails(777, 777)).toStrictEqual({ error: expect.any(String) });

    const academic = academicCreate('Justin', 'pole dancing');
    // invalid academicToViewId
    expect(academicDetails(academic.academicId, academic.academicId + 1)).toStrictEqual({ error: expect.any(String) });

    // invalid academicId
    expect(academicDetails(academic.academicId + 1, academic.academicId)).toStrictEqual({ error: expect.any(String) });

  });

  test('successful course return', ()=> {
    const academic = academicCreate('Justin', 'pole dancing');
    const course = courseCreate(academic.academicId, 'POLE1101', 'pole dancing fundamentals');
    expect(courseDetails(academic.academicId, course.courseId)).toStrictEqual({
      course: {
        courseId: course.courseId,
        name: 'POLE1101',
        description: 'pole dancing fundamentals',
        allMembers: [academicDetails(academic.academicId, academic.academicId)],
        staffMembers: [academicDetails(academic.academicId, academic.academicId)],
      }
    });
  });

  test('unsuccessful course return', ()=> {
    const academic = academicCreate('Justin', 'pole dancing');
    const course = courseCreate(academic.academicId, 'POLE1101', 'pole dancing fundamentals');

    // invalid academicId
    expect(courseDetails(academic.academicId + 1, course.courseId)).toStrictEqual({ error: expect.any(String) });
    
    // invalid courseId
    expect(courseDetails(academic.academicId, course.courseId + 1)).toStrictEqual({ error: expect.any(String) });

    // invalid academicId and courseId
    expect(courseDetails(academic.academicId + 1, course.courseId + 1)).toStrictEqual({ error: expect.any(String) });

    // academicId refers to an academic not in the specified course
    const academic2 = academicCreate('Peter', 'tutoring');
    expect(courseDetails(academic2.academicId, course.courseId)).toStrictEqual({ error: expect.any(String) });
  });

  test('successful list of academics return', ()=> {
    const academic = academicCreate('Justin', 'pole dancing');
    const academic2 = academicCreate('Peter', 'tutoring');

    const listAcademics = new Set();
    listAcademics.add(
      {
        academicId: academic.academicId, 
        academicName: academicDetails(academic.academicId, academic.academicId).name,
      }
    );
    listAcademics.add(
      {
        academicId: academic2.academicId, 
        academicName: academicDetails(academic2.academicId, academic2.academicId).name,
      }
    );

    const list = academicsList(academic.academicId);
    const listAcademicsCompare = new Set(list);

    expect(listAcademics).toStrictEqual(listAcademicsCompare);
  });

  test('unsuccessful list of academics return', ()=> {
    expect(academicsList(777)).toStrictEqual({ error: expect.any(String) });
  });

  test('successful list of courses return', ()=> {
    const academic = academicCreate('Justin', 'pole dancing');
    const course = courseCreate(academic.academicId, 'POLE1101', 'pole dancing fundamentals');
    const academic2 = academicCreate('Peter', 'tutoring');
    const course2 = courseCreate(academic2.academicId, 'TUTE1101', 'tutoring fundamentals');

    const listCourses = new Set();
    listCourses.add(
      {
        courseId: course.courseId, 
        courseName: courseDetails(academic.academicId, course.courseId).name,
      }
    );
    listCourses.add(
      {
        courseId: course.courseId, 
        courseName: courseDetails(academic2.academicId, course2.courseId).name,
      }
    );

    const list = CoursesList(academic.academicId);
    const listCoursesCompare = new Set(list);

    expect(listCourses).toStrictEqual(listCoursesCompare);
  });

  test('unsuccessful list of courses return', ()=> {
    expect(coursesList(777)).toStrictEqual({ error: expect.any(String) });
  });
});


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
