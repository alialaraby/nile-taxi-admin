export enum ResponseActionType{
    Added = 1,
    Updated = 2,
    Deleted = 3,
    Sent = 4
}

export enum Genders{
    Male = 'male',
    Female = 'female'
}

export enum TripTypes{
    Daily = 'daily',
    Private = 'private',
    Pooling = 'pooling',
    Tour = 'tour',
}

export enum TripStatus{
    // NotStarted = 'notStarted',
    Ready = 'ready', //created by admin (not yet accepted by any pilot)
    AcceptedByPilot = 'acceptedByPilot',
    Started = 'started', // pilot started the trip
    Completed = 'completed', // pilot ended/completed the trip
    Cancelled = 'cancelled', // pilot cancelled the trip
}

export enum RequestedTripStatus{
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected',
}

export enum PaymentMethods{
    Cash = 'cash',
}

export enum BoatStatus{
    Ready = 'ready',
    NeedMaintenance = 'needMaintenance',
    InMaintenance = 'inMaintenance',
}

export enum UserType{
    Admin = 'admin',
    Pilot = 'pilot',
    Passenger = 'passenger',
}