/**
 * @module academics
 */

 const dataStore = {
  academics: [],
  courses: []
}

let currAcademicId = -1;
let currCourseId = -1;

/**
 * Creates a new academic, returning an object containing
 * a unique academic id
 *
 * @param {string} name
 * @param {string} hobby
 * @returns {{academicId: number}}
 */
export function academicCreate(name, hobby) {
  if (name === '' || hobby === '') {
    return {
      error: 'Name or hobby is empty',
    };
  }

  currAcademicId++;

  dataStore.academics.push(
    {
      academicId: currAcademicId,
      name: name,
      hobby: hobby,
    }
  );

  return {
    academicId: currAcademicId,
  };

}

/**
 * Creates a new course, returning an object containing a unique course id. 
 * The academic who created the course is both a staff and a member.
 *
 * @param {number} academicId
 * @param {string} name
 * @param {string} description
 * @returns {{courseId: number}}
 */
export function courseCreate(academicId, name, description) {
  const id = academicId;
  const academic = dataStore.academics.find(({ academicId }) => academicId === id);
  if (academic === undefined) {
    return {
      error: 'AcademicId is invalid',
    };
  }

  let letters = name.slice(4);
  let numbers = name.slice(4,8);
  let invalidName = false;

  if (name.length != 8) {
    invalidName = true;
  }

  if (isNaN(numbers)) {
    invalidName = true;
  }

  for (let i = 0; i < 4; i++) {
    if (letters[i] === undefined || letters[i].toLowerCase === letters[i]) {
      invalidName = true;
      break;
    }
  }

  if (invalidName) {
    return {
      error: 'Course name is invalid',
    };
  }

  currCourseId++;

  dataStore.courses.push( 
    {
      courseId: currCourseId,
      name: name,
      description: description,
      allMembers: [academicId],
      staffMembers: [academicId],
    }
  );

  return {
    courseId: currCourseId,
  };
}

/**
 * Return an object containing details about the academicToView.
 */
export function academicDetails(academicId, academicToViewId) {
  const id = academicId;
  let academic = dataStore.academics.find(({ academicId }) => academicId === id);
  if (academic === undefined) {
    return {
      error: 'academicId is invalid',
    };
  }
  
  const idView = academicToViewId;
  let academicView = dataStore.academics.find(({ academicId }) => academicId === idView);
  if (academicView === undefined) {
    return {
      error: 'academicToViewId is invalid',
    };
  }

  academic = academicView;

  return {
    academic,
  };
}

export function courseDetails(academicId, courseId) {
  let id = academicId;
  const academic = dataStore.academics.find(({ academicId }) => academicId === id);
  if (academic === undefined) {
    return {
      error: 'academicId is invalid',
    };
  }

  id = courseId;
  let courseRef = dataStore.courses.find(({ courseId }) => courseId === id);
  if (courseRef === undefined) {
    return {
      error: 'courseId is invalid',
    };
  }

  const isMember = courseRef.allMembers.find(element => element === academicId);
  if (isMember === undefined) {
     return {
      error: 'Not a member of the course',
     };
  }

  let course = courseRef;
  course.allMembers = [];
  for (const id of courseRef.allMembers) {
    let academic = academicDetails(id, id);
    course.allMembers.push(
      {
        academic,
      }
    );
  }

  course = courseRef;
  course.staffMembers = [];
  for (const id of courseRef.staffMembers) {
    let academic = academicDetails(id, id);
    course.staffMembers.push(
      {
        academic,
      }
    );
  }

  return {
    course,
  };
}

export function academicsList(academicId) {
  const id = academicId;
  const academic = dataStore.academics.find(({ academicId }) => academicId === id);
  if (academic === undefined) {
    return {
      error: 'academicId is invalid',
    };
  }

  const academics = [];

  for (const academic of dataStore.academics) {
    academics.push(
      {
        academicId: academic.academicId,
        academicName: academic.name,
      }
    );
  }

  return {
    academics,
  };
}

export function coursesList(academicId) {
  const id = academicId;
  const academic = dataStore.academics.find(({ academicId }) => academicId === id);
  if (academic === undefined) {
    return {
      error: 'academicId is invalid',
    };
  }

  const courses = [];

  for (const course of dataStore.courses) {
    courses.push(
      {
        courseId: course.courseId,
        courseName: course.name,
      }
    )
  }

  return {
    courses,
  };
}

export function courseEnrol(academicId, courseId, isStaff) {
  let id = academicId;
  const academic = dataStore.academics.find(({ academicId }) => academicId === id);
  if (academic === undefined) {
    return {
      error: 'academicId is invalid',
    };
  }

  id = courseId;
  const course = dataStore.courses.find(({ courseId }) => courseId === id);
  if (course === undefined) {
    return {
      error: 'courseId is invalid',
    };
  }
  
  const isStaffMember = course.staffMembers.find(element => element === academicId);
  if ((isStaffMember != undefined) && (isStaff === true)) {
     return {
      error: 'already an existing staff of the course',
     };
  }

  const isMember = course.allMembers.find(element => element === academicId);
  if (isMember != undefined) {
     return {
      error: 'already an existing member of the course',
     };
  }

  if (isStaffMember === true) {
    course.staffMembers.push(academicId);
  }
  course.allMembers.push(academicId);

  return {};
}

export function clear() {
  dataStore.academics = [];
  dataStore.courses = [];
  currAcademicId = -1;
  currCourseId = -1;
  return {};
}
