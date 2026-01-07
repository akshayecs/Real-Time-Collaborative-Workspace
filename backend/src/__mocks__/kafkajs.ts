const mockProducer = {
    connect: jest.fn(),
    send: jest.fn(),
    disconnect: jest.fn(),
};

const mockConsumer = {
    connect: jest.fn(),
    subscribe: jest.fn(),
    run: jest.fn(),
    disconnect: jest.fn(),
};

export const Kafka = jest.fn(() => ({
    producer: () => mockProducer,
    consumer: () => mockConsumer,
}));

export const logLevel = {
    NOTHING: 0,
};
